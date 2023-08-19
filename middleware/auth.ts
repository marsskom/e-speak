export default defineNuxtRouteMiddleware((to, from) => {
  if (true /* false === isAuthenticated() */) {
    return navigateTo("/login");
  }
});
