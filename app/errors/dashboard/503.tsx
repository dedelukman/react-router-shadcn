import { ErrorLayout } from "~/components/error-layout";
import { errorData } from "~/data/error-data";

interface ServerErrorPageProps {
  onRetry?: () => void;
}

export default function Page({ onRetry }: ServerErrorPageProps) {
  return (
    <ErrorLayout 
      errorConfig={errorData[503]} 
      onRetry={onRetry}
    />
  );
}