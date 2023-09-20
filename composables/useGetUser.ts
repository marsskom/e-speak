import { useAuthStore } from "~/stores/Auth/auth";

export default function () {
  const authStore = useAuthStore();

  return computed(() => authStore.getUser).value;
}
