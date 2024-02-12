import { computed } from "vue";
import { useRoute } from "vue-router";

export const useSelectedProduct = () => {
  const route = useRoute();
  
return computed(() => route.params.productId);
};
