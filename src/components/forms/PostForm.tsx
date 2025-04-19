import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [tags, setTags] = useState(post ? post.tags.join(",") : "");

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleImageRecognition = async (imageFile: File) => {
    const apiKey = import.meta.env.VITE_GOOGLE_VISION_KEY;
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const base64Image = await convertFileToBase64(imageFile);

    const requestPayload = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 10,
            },
          ],
        },
      ],
    };

    const response = await axios.post(apiUrl, requestPayload);
    console.log("Vision API response:", response.data);
    return response.data.responses[0].labelAnnotations.map(
      (label: any) => label.description
    );
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      setIsAnalyzingImage(true);
      try {
        const tagsFromAI = await handleImageRecognition(files[0]);
        console.log("Tags from AI:", tagsFromAI); // Log the tags received from AI
        setTags(tagsFromAI.join(","));
      } catch (error) {
        toast({
          title: "Image recognition failed. Please try again.",
        });
        console.error(error);
      } finally {
        setIsAnalyzingImage(false);
      }
    }
  };

  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      if (value.file.length > 0 && !tags) {
        setIsAnalyzingImage(true);
        const tagsFromAI = await handleImageRecognition(value.file[0]);

        const existingTags = value.tags
          ? value.tags.split(",").map((tag) => tag.trim())
          : [];
        const updatedTags = [...existingTags, ...tagsFromAI].join(",");

        value.tags = updatedTags;
      } else {
        value.tags = tags;
      }

      if (post && action === "Update") {
        const updatedPost = await updatePost({
          ...value,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
        });

        if (!updatedPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        }
        return navigate(`/posts/${post.$id}`);
      }

      const newPost = await createPost({
        ...value,
        userId: user.id,
      });

      if (!newPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      navigate("/");
    } catch (error) {
      toast({
        title: "Image recognition failed. Please try again.",
      });
      console.error(error);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={(files: File[]) => {
                    field.onChange(files);
                    handleFileChange(files);
                  }}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                  value={tags} // Ensure value is being set
                  onChange={(e) => {
                    setTags(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate || isAnalyzingImage}>
            {(isLoadingCreate || isLoadingUpdate || isAnalyzingImage) && (
              <Loader />
            )}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
