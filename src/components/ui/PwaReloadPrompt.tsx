import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './Button';

export const PwaReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: unknown) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm flex flex-col gap-3">
      <div className="text-sm text-gray-800 dark:text-gray-200">
        {offlineReady
          ? <span>Ứng dụng đã sẵn sàng hoạt động offline.</span>
          : <span>Đã có phiên bản mới, vui lòng tải lại để cập nhật.</span>}
      </div>
      <div className="flex gap-2">
        {needRefresh && (
          <Button variant="primary" onClick={() => updateServiceWorker(true)} className="py-1.5 px-3 text-sm">
            Tải lại
          </Button>
        )}
        <Button variant="secondary" onClick={close} className="py-1.5 px-3 text-sm">
          Đóng
        </Button>
      </div>
    </div>
  );
};