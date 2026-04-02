import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Chào mừng bạn trở lại với quá trình học HSK.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng số từ vựng</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cần ôn tập hôm nay</h3>
          <p className="text-3xl font-bold mt-2 text-orange-500">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Đã học hoàn toàn</h3>
          <p className="text-3xl font-bold mt-2 text-green-500">0</p>
        </Card>
      </div>

      <div className="flex gap-4 mt-8">
        <Button onClick={() => navigate('/add')}>
          Thêm từ mới
        </Button>
        <Button variant="outline" onClick={() => navigate('/review')}>
          Bắt đầu ôn tập
        </Button>
      </div>
    </div>
  );
}