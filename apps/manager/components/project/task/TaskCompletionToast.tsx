import { toast } from 'sonner'

interface TaskCompletionToastProps {
  onWriteNow: () => void
}

export const showTaskCompletionToast = ({
  onWriteNow,
}: TaskCompletionToastProps) => {
  toast.custom(
    (t) => (
      <div className="bg-white rounded-lg shadow-lg p-4 w-[400px]">
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-gray-900">
            Task 완료! 간단한 회고로 마무리해 볼까요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              나중에
            </button>
            <button
              onClick={() => {
                toast.dismiss(t)
                onWriteNow()
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cm rounded-md hover:bg-cm-700"
            >
              지금 작성
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000,
    }
  )
}
