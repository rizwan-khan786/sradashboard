"use client";
import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const API_BASE_URL = "http://sra.saavi.co.in";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/api/sra-logs/dashboard-stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatsCard = ({ title, value, icon, colorClass = "bg-blue-500", trend = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClass} rounded-full p-3 mr-4`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && <p className="text-sm text-gray-500 mt-1">{trend}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 20, padding: 20 } },
      title: { display: true, font: { size: 18 }, padding: 20 },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Number of Records" } },
      y: { title: { display: true } },
    },
    plugins: { ...chartOptions.plugins, legend: { display: false } },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Submissions" } },
      x: { title: { display: true, text: "Date" } },
    },
  };

  const chartColors = {
    background: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"],
    border: ["#2A8CC7", "#D44F6E", "#0A8F6A", "#D4A017", "#7F4FC3"],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading SRA Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">Error loading dashboard</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 SRA Analytics Dashboard</h1>
        <p className="text-gray-600 text-lg">Real-time insights for Slum Redevelopment Authority applications</p>
      </div>


      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📊 Executive Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{dashboardData.totalRecords?.[0]?.count || 0}</div>
            <div className="text-blue-800 text-sm font-medium">Total Applications</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{dashboardData.todayRecords?.[0]?.count || 0}</div>
            <div className="text-green-800 text-sm font-medium">Today's Submissions</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{dashboardData.maleRecords?.[0]?.count || 0}</div>
            <div className="text-orange-800 text-sm font-medium">Male Applicants</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{dashboardData.photoSelfSubmitted?.[0]?.count || 0}</div>
            <div className="text-purple-800 text-sm font-medium">Photos Submitted</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Records"
          value={dashboardData.totalRecords?.[0]?.count || 0}
          icon="📊"
          colorClass="bg-blue-600"
          trend="All applications"
        />
        <StatsCard
          title="Today's Records"
          value={dashboardData.todayRecords?.[0]?.count || 0}
          icon="📅"
          colorClass="bg-green-600"
          trend="As of July 24, 2025"
        />
        <StatsCard
          title="Male Applicants"
          value={dashboardData.maleRecords?.[0]?.count || 0}
          icon="👨"
          colorClass="bg-orange-600"
          trend="Demographics"
        />
        <StatsCard
          title="Photos Submitted"
          value={dashboardData.photoSelfSubmitted?.[0]?.count || 0}
          icon="📸"
          colorClass="bg-purple-600"
          trend="Document uploads"
        />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📈 Time Series Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Line
              data={{
                labels: dashboardData.byDay?.map(item => item.day) || [],
                datasets: [{
                  label: "Daily Submissions",
                  data: dashboardData.byDay?.map(item => item.count) || [],
                  fill: false,
                  borderColor: chartColors.background[0],
                  backgroundColor: chartColors.background[0],
                  tension: 0.1,
                }],
              }}
              options={{
                ...lineChartOptions,
                plugins: { ...lineChartOptions.plugins, title: { ...lineChartOptions.plugins.title, text: "Daily Submission Trends" } },
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Line
              data={{
                labels: dashboardData.byMonth?.map(item => item.month) || [],
                datasets: [{
                  label: "Monthly Submissions",
                  data: dashboardData.byMonth?.map(item => item.count) || [],
                  fill: false,
                  borderColor: chartColors.background[2],
                  backgroundColor: chartColors.background[2],
                  tension: 0.1,
                }],
              }}
              options={{
                ...lineChartOptions,
                plugins: { ...lineChartOptions.plugins, title: { ...lineChartOptions.plugins.title, text: "Monthly Submission Trends" } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📊 Categorical Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Bar
              data={{
                labels: dashboardData.byMunicipalCorporation?.map(item => item.municipal_corporation) || [],
                datasets: [{
                  label: "Records by Municipal Corporation",
                  data: dashboardData.byMunicipalCorporation?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...barChartOptions,
                plugins: { ...barChartOptions.plugins, title: { ...barChartOptions.plugins.title, text: "Municipal Corporation Distribution" } },
                scales: { ...barChartOptions.scales, y: { ...barChartOptions.scales.y, title: { display: true, text: "Municipal Corporation" } } },
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Bar
              data={{
                labels: dashboardData.byDistrict?.map(item => item.district) || [],
                datasets: [{
                  label: "Records by District",
                  data: dashboardData.byDistrict?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...barChartOptions,
                plugins: { ...barChartOptions.plugins, title: { ...barChartOptions.plugins.title, text: "District-wise Applications" } },
                scales: { ...barChartOptions.scales, y: { ...barChartOptions.scales.y, title: { display: true, text: "District" } } },
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Bar
              data={{
                labels: dashboardData.byFamilyMembers?.map(item => item.family_size) || [],
                datasets: [{
                  label: "Records by Family Size",
                  data: dashboardData.byFamilyMembers?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...barChartOptions,
                plugins: { ...barChartOptions.plugins, title: { ...barChartOptions.plugins.title, text: "Family Size Distribution" } },
                scales: { ...barChartOptions.scales, y: { ...barChartOptions.scales.y, title: { display: true, text: "Family Size" } } },
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Bar
              data={{
                labels: dashboardData.byAreaRange?.map(item => item.area_range) || [],
                datasets: [{
                  label: "Records by Area Range",
                  data: dashboardData.byAreaRange?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...barChartOptions,
                plugins: { ...barChartOptions.plugins, title: { ...barChartOptions.plugins.title, text: "Property Area Ranges" } },
                scales: { ...barChartOptions.scales, y: { ...barChartOptions.scales.y, title: { display: true, text: "Area Range" } } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🥧 Distribution Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Pie
              data={{
                labels: dashboardData.byGender?.map(item => item.gender) || [],
                datasets: [{
                  data: dashboardData.byGender?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Gender Distribution" } },
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Pie
              data={{
                labels: dashboardData.bySlumUse?.map(item => item.slum_use) || [],
                datasets: [{
                  data: dashboardData.bySlumUse?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Slum Usage Distribution" } },
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Pie
              data={{
                labels: dashboardData.bySocietyRegistered?.map(item => item.society_registered) || [],
                datasets: [{
                  data: dashboardData.bySocietyRegistered?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Society Registration Status" } },
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96">
            <Pie
              data={{
                labels: dashboardData.byPlanSubmitted?.map(item => item.plan_submitted) || [],
                datasets: [{
                  data: dashboardData.byPlanSubmitted?.map(item => item.count) || [],
                  backgroundColor: chartColors.background,
                  borderColor: chartColors.border,
                  borderWidth: 1,
                }],
              }}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Plan Submission Status" } },
              }}
            />
          </div>
        </div>
      </div>

      

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 text-sm">
          📅 Dashboard last updated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} | 📊 Total Records: {dashboardData.totalRecords?.[0]?.count || 0}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;