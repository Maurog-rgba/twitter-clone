import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useEditProfile = () => {

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async ({
      fullName,
      username,
      email,
      bio,
      currentPassword,
      newPassword,
      link,
    }) => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            bio,
            currentPassword,
            newPassword,
            link,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries(["authUser"]),
        queryClient.invalidateQueries(["userProfile"]),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateProfile, isUpdatingProfile };
};