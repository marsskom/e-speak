export default defineNuxtRouteMiddleware((to) => {
  if (useIsGuest()) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
