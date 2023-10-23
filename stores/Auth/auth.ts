import { type User } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user: Ref<User> = ref({} as User);
  const isGuestValue: Ref<boolean> = ref(true);

  const isGuest: ComputedRef<boolean> = computed(() => isGuestValue.value);
  const getUser: ComputedRef<User> = computed(() => user.value);

  const writeUserData = (loggedUser: undefined | null | User): void => {
    if (!loggedUser) {
      user.value = {} as User;
      isGuestValue.value = true;
    } else {
      user.value = loggedUser;
      isGuestValue.value = false;
    }
  };

  return {
    user,
    isGuestValue,

    isGuest,
    getUser,

    writeUserData,
  };
});
