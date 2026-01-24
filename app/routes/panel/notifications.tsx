import Notifications from '~/components/panel/notifications';
import { RequirePermission } from '~/lib/RequirePermission';

export default function NotificationsPage() {
  return  <RequirePermission permission="NOTIFICATION_VIEW">
         <Notifications />;
      </RequirePermission>
}
