import React from "react";
import { UsersRound, ClipboardList, FlaskConical, CreditCard, CalendarDays, MoreVertical } from "lucide-react";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import RevenueChart from "./RevenueChart";
import { dashboardData, orders, revenuePoints } from "../data/mockData";

export default function Dashboard({ t }) {
  const statusLabel = {
    completed: t.completed,
    pending: t.pending,
    progress: t.progress,
  };

  return (
    <main className="content">
      <div className="page-head">
        <div>
          <h1>{t.greeting} <span>👋</span></h1>
          <p>{t.subtitle}</p>
        </div>
        <button className="date-button"><CalendarDays size={17} /> 11 Aug 2026 <span>⌄</span></button>
      </div>

      <section className="stats-grid">
        <StatCard icon={UsersRound} title={t.totalClients} value={dashboardData.clients.toLocaleString()} change={12.5} color="blue" note={t.fromLastMonth} />
        <StatCard icon={ClipboardList} title={t.ordersToday} value={dashboardData.orders} change={8.3} color="purple" note={t.fromYesterday} />
        <StatCard icon={FlaskConical} title={t.pendingResults} value={dashboardData.pendingResults} change={-4.2} color="orange" note={t.fromYesterday} />
        <StatCard icon={CreditCard} title={t.todaysRevenue} value={`${dashboardData.revenue.toLocaleString()} EGP`} change={15.7} color="green" note={t.fromYesterday} />
      </section>

      <section className="dashboard-grid">
        <article className="panel orders-panel">
          <div className="panel-head">
            <h2>{t.recentOrders}</h2>
            <button className="link-button">{t.viewAll}</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t.client}</th><th>{t.service}</th><th>{t.status}</th><th>{t.deliveryDate}</th><th>{t.amount}</th><th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.client + o.service}>
                    <td>{o.client}</td>
                    <td>{o.service}</td>
                    <td><StatusBadge status={o.status} label={statusLabel[o.status]} /></td>
                    <td>{o.date}</td>
                    <td>{o.amount.toLocaleString()} EGP</td>
                    <td><button className="table-action"><MoreVertical size={17}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel revenue-panel">
          <div className="panel-head">
            <h2>{t.revenueOverview}</h2>
            <button className="select-button">{t.thisMonth} <span>⌄</span></button>
          </div>
          <div className="revenue-value">
            <strong>45,200 <small>EGP</small></strong>
            <span>↑ 15.7% <em>{t.fromLastMonth}</em></span>
          </div>
          <RevenueChart points={revenuePoints} />
        </article>
      </section>
    </main>
  );
}
