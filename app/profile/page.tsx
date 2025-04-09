"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/user-context";
import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipe-card";

const profileFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  username: z.string().min(2).max(30).optional(),
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, login, isLoading } = useUser();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user?.email) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        username: user.username || "",
      });

      fetch("/api/recipes/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.recipes) setSavedRecipes(data.recipes);
        })
        .catch((err) => console.error("Error fetching saved recipes", err));
    }
  }, [user, isLoading, router, form]);

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update user");

      login(result.user);
      toast({ title: "Profile updated successfully." });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        type: "error",
      });
    }
  }

  if (isLoading || !user) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl || ""} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="w-full">
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {savedRecipes.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Saved</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Created</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="recipes">
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="recipes" className="flex-1">
                  My Recipes
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">
                  Profile
                </TabsTrigger>
              </TabsList>

              {/* Saved Recipes */}
              <TabsContent value="recipes">
                <h3 className="text-xl font-semibold mb-4">Saved Recipes</h3>
                {savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {savedRecipes.map((recipe) => (
                      <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        You haven’t saved any recipes yet.
                      </p>
                      <Button asChild>
                        <a href="/recipes">Browse Recipes</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Profile Form */}
              <TabsContent value="settings">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Profile Details</h3>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            name="bio"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-6 space-y-2">
                      <p>
                        <strong>Name:</strong> {user.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      {user.username && (
                        <p>
                          <strong>Username:</strong> {user.username}
                        </p>
                      )}
                      {user.bio && (
                        <p>
                          <strong>Bio:</strong> {user.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
