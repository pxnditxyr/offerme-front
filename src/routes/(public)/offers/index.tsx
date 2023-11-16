import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useGetPromotions = routeLoader$( async () => {
  return {
    promotions: [
      { name: "Promotion 1" },
      { name: "Promotion 2" },
      { name: "Promotion 3" },
    ],
  }
} )

export default component$( () => {

  const promotions = useGetPromotions().value

  return (
    <div>
      <h1>Hello World</h1>
      <pre>
        {JSON.stringify( promotions, null, 2 )}
      </pre>
    </div>
  )
} )
