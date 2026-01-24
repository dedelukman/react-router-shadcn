// Di halaman utama
import Billing from '~/components/panel/billing';
import { RequirePermission } from '~/lib/RequirePermission';

export default function BillingPage() {
  return   <RequirePermission permission="BILLING_VIEW">
       <Billing />;
    </RequirePermission>
 
}
