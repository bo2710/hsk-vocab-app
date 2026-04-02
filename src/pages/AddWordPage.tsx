import { Card } from '../components/ui/Card';
import { AddWordForm } from '../components/forms/AddWordForm';

export default function AddWordPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Thêm từ mới</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Lưu từ vựng mới kèm theo ngữ cảnh.</p>
      </header>

      <Card className="p-6 md:p-8">
        <AddWordForm />
      </Card>
    </div>
  );
}