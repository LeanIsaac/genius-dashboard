import { useEffect, useState } from "react";
import { getBudgetSummary } from "../services/budgetManagerApi";
import { getLandings } from "../services/landingCrmApi";

export default function Dashboard() {
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [landings, setLandings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getBudgetSummary(), getLandings()])
      .then(([budget, crm]) => {
        if (budget.status === "fulfilled") setBudgetSummary(budget.value);
        if (crm.status === "fulfilled") setLandings(crm.value);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="state-msg">Cargando...</p>;

  const totalLeads = landings
    ? landings.reduce((sum, l) => sum + (l.leadCount ?? 0), 0)
    : null;

  return (
    <main className="page">
      <h1>Dashboard</h1>

      {/* TODO GD-F04: completar tarjetas de indicadores globales */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Campañas activas</div>
          <div className="kpi-value">
            {budgetSummary?.activeCampaigns ?? "—"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Presupuesto total</div>
          <div className="kpi-value">
            {budgetSummary?.totalBudget != null
              ? `$${budgetSummary.totalBudget.toLocaleString()}`
              : "—"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total gastado</div>
          <div className="kpi-value">
            {budgetSummary?.totalSpent != null
              ? `$${budgetSummary.totalSpent.toLocaleString()}`
              : "—"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total leads</div>
          <div className="kpi-value">{totalLeads ?? "—"}</div>
        </div>
      </div>

      {/* TODO GD-F05: agregar selector de cliente para filtrar la vista */}
    </main>
  );
}
