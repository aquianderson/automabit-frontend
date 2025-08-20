import { Home, History, AlertTriangle, FileText, BarChart3 } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'inicio', label: 'INÍCIO', icon: Home },
    { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
    { id: 'historico', label: 'HISTÓRICO', icon: History },
    { id: 'alertas', label: 'ALERTAS', icon: AlertTriangle },
    { id: 'relatorios', label: 'RELATÓRIOS', icon: FileText },
  ];

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;

