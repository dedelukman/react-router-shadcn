import GetHelp from '~/components/panel/gethelp';
import { RequirePermission } from '~/lib/RequirePermission';

export default function GetHelpPage() {
  return  <RequirePermission permission="GETHELP_VIEW">
         <GetHelp />;
      </RequirePermission>
}
