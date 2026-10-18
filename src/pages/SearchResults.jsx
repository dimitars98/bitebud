import { useSearchParams } from "react-router-dom";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import RestaurantCard from "../components/RestaurantCard";
import { useTranslation } from "react-i18next";

export default function SearchResults() {
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const query = params.get("q")?.toLowerCase() || "";

  const { data: restaurants = [] } = useRestaurantsQuery();

  const normalizedQuery = (query || "").toLowerCase();

  const results = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="bg-gradient-to-b from-(--bg-main) to-(--bg-primary) dark:from-(--brand-bg-primary) dark:to-(--brand-bg-secondary) text-(--text-secondary) dark:text-(--text-secondary) min-h-fit">
      {results.length > 0 ? (
        <section className="pt-40 pb-20 md:pt-20">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <h2 className="text-4xl font-bold text-center">
              {t("search.resultsFor", { query })}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {results.map((rest) => (
                <RestaurantCard key={rest.id} {...rest} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold">{t("search.noneTitle")}</h2>
            <p className="text-gray-500 dark:text-gray-300 mt-4">
              {t("search.noneBody")}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
