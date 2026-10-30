import { PageTemplate } from "@/components/page-template";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Link, router, usePage } from "@inertiajs/react";
import { ArchiveRestore } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/custom-toast";
import { hasPermission } from "@/utils/authorization";

export default function ArchivedCases() {
  const { t } = useTranslation();
  const { cases, auth } = usePage().props as any;

  const restore = (caseItem: any) => {
    router.post(
      route("cases.restore", caseItem.id),
      {},
      {
        onSuccess: (page) => {
          if (page.props.flash.success) toast.success(page.props.flash.success);
        },
        onError: (errors) =>
          toast.error(
            Object.values(errors).join(", ") ||
              t("Unable to restore this case."),
          ),
      },
    );
  };

  return (
    <PageTemplate
      title={t("Archived Cases")}
      url="/cases/archive"
      breadcrumbs={[
        { title: t("Dashboard"), href: route("dashboard") },
        { title: t("Case Management"), href: route("cases.index") },
        { title: t("Archived Cases") },
      ]}
      description={t(
        "Archived operational cases remain available for read-only reference.",
      )}
    >
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">{t("Case")}</th>
              <th className="p-3">{t("Client")}</th>
              <th className="p-3">{t("Archived at")}</th>
              <th className="p-3">{t("Archived by")}</th>
              <th className="p-3">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {(cases?.data || []).map((caseItem: any) => (
              <tr key={caseItem.id} className="border-b last:border-0">
                <td className="p-3">
                  <Link
                    className="font-medium underline"
                    href={route("cases.show", caseItem.id)}
                  >
                    {caseItem.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {caseItem.case_id}
                  </div>
                </td>
                <td className="p-3">{caseItem.client?.name || "—"}</td>
                <td className="p-3">{caseItem.archived_at || "—"}</td>
                <td className="p-3">{caseItem.archiver?.name || "—"}</td>
                <td className="p-3">
                  {hasPermission(auth?.permissions || [], "restore-cases") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restore(caseItem)}
                    >
                      <ArchiveRestore className="mr-2 h-4 w-4" />
                      {t("Restore")}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {!cases?.data?.length && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  {t("No archived cases.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          from={cases?.from || 0}
          to={cases?.to || 0}
          total={cases?.total || 0}
          links={cases?.links}
          entityName={t("cases")}
          onPageChange={(url) => router.get(url, {}, { preserveScroll: true })}
        />
      </div>
    </PageTemplate>
  );
}
