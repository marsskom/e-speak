import { type User } from "firebase/auth";

import { useAuthStore } from "~/stores/Auth/auth";

export default function (): User {
  const authStore = useAuthStore();

  return computed(() => authStore.getUser).value;
}
