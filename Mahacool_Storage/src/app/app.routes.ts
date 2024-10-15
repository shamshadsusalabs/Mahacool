import { Routes } from '@angular/router';
import { authGuard } from './_Authentication/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./_Authentication/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./_Authentication/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./_Authentication/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./_Authentication/forget-password/forget-password.component').then(c => c.ForgetPasswordComponent)
  },
  {
    path: 'Admin',
    canActivate: [authGuard] ,
    loadComponent: () => import('./_Admin-component/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'main-content',
        pathMatch: 'full'
      },
      {
        path: 'main-content',
        loadComponent: () => import('./_Admin-component/dashboard/manin/manin.component').then(c => c.ManinComponent)
      },
      {
        path: 'client',
        loadComponent: () => import('./_Admin-component/Transporter/client/client.component').then(c => c.ClientComponent),
      },
      {
        path: 'manager',
        loadComponent: () => import('./_Admin-component/Manager/manager/manager.component').then(c => c.ManagerComponent),
      },
      {
        path: 'driver',
        loadComponent: () => import('./_Admin-component/Transporter/driver/driver.component').then(c => c.DriverComponent),
      },
      {
        path: 'security',
        loadComponent: () => import('./_Admin-component/Transporter/security/security.component').then(c => c.SecurityComponent),
      },
      {
        path: 'cities',
        loadComponent: () => import('./_Admin-component/Transporter/Cities/city/city.component').then(c => c.CityComponent),
      },
      {
        path: 'addcities',
        loadComponent: () => import('./_Admin-component/Transporter/Cities/addcity/addcity.component').then(c => c.AddcityComponent),
      },
      {
        path: 'warehouse',
        loadComponent: () => import('./_Admin-component/Transporter/warehouse/warehouse.component').then(c => c.WarehouseComponent),
      },
      {
        path: 'rack',
        loadComponent: () => import('./_Admin-component/Transporter/rack/rack.component').then(c => c.RackComponent),
      },
      {
        path: 'story',
        loadComponent: () => import('./_Admin-component/Transporter/story/story.component').then(c => c.StoryComponent),
      },
      {
        path: 'bag',
        loadComponent: () => import('./_Admin-component/Transporter/gunnybag/bag/bag.component').then(c => c.BagComponent),
      },
      {
        path: 'allhistory',
        loadComponent: () => import('./_Admin-component/Transporter/gunnybag/allhistory/allhistory.component').then(c => c.AllhistoryComponent),
      },
      {
        path: 'addbag',
        loadComponent: () => import('./_Admin-component/Transporter/gunnybag/add-gunny-bag/add-gunny-bag.component').then(c => c.AddGunnyBagComponent),
      },
      {
        path: 'uplodgunnybag',
        loadComponent: () => import('./_Admin-component/Transporter/gunnybag/uplodgunnybox/uplodgunnybox.component').then(c => c.UplodgunnyboxComponent),
      },
      {
        path: 'qrcode',
        loadComponent: () => import('./_Admin-component/Transporter/gunnybag/qr-code/qr-code.component').then(c =>c.QrCodeComponent ),
      },
      {
        path: 'passwordreset',
        loadComponent: () => import('./_Admin-component/_PasswordRequestRest/password-request/password-request.component').then(c =>c.PasswordRequestComponent ),
      },
      {
        path: 'request-warehouse',
        loadComponent: () => import('./_Admin-component/Transporter/warehouse-requested/warehouse-requested.component').then(c =>c.WarehouseRequestedComponent ),
      },
      {

        path: 'push-notification',
        loadComponent: () => import('./_Admin-component/Transporter/push-notification/push-notification.component').then(c => c.PushNotificationComponent),
      },

      {

        path: 'AllinvoicesApproved',
        loadComponent: () => import('./_Admin-component/Transporter/invoices/invoices.component').then(c => c.InvoicesComponent),
      },
      {

        path: 'Allinvoices',
        loadComponent: () => import('./_Admin-component/Transporter/all-invoices/all-invoices.component').then(c => c.AllInvoicesComponent),
      },
      {

        path: 'warehouseCheckout-requested',
        loadComponent: () => import('./_Admin-component/Transporter/warehouserequestcheckout/warehouserequestcheckout.component').then(c => c.WarehouserequestcheckoutComponent),
      },
      {

        path: 'monthly_invoice',
        loadComponent: () => import('./_Admin-component/Transporter/monthly-clinet-inviice-form/monthly-clinet-inviice-form.component').then(c => c.MonthlyClinetInviiceFormComponent),
      },
      {

        path: 'totalstock',
        loadComponent: () => import('./_Admin-component/dashboard/totastock/totastock.component').then(c => c.TotastockComponent),
      },
      {

        path: 'monthly-view',
        loadComponent: () => import('./_Admin-component/dashboard/monthly-biill/monthly-biill.component').then(c => c.MonthlyBiillComponent),
      },
      {

        path: 'client-details',
        loadComponent: () => import('./_Admin-component/Transporter/client-all-details/client-all-details.component').then(c => c.ClientAllDetailsComponent),
      }


    ]
  },


  {
    path: 'Client',

    loadComponent: () => import('./_ClientComponent/clientdashboard/clientdashboard.component').then(c => c.ClientdashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'Cmain-content',
        pathMatch: 'full'
      },
      {
        path: 'Cmain-content',
        loadComponent: () => import('./_ClientComponent/main-component/main-component.component').then(c => c.MainComponentComponent)
      },

      {

      path: 'profile',
      loadComponent: () => import('./_ClientComponent/profile/profile.component').then(c => c.ProfileComponent),
    },
    {

      path: 'client-city',
      loadComponent: () => import('./_ClientComponent/city/city.component').then(c => c.CityComponent),
    },
    {

      path: 'client-warehouse',
      loadComponent: () => import('./_ClientComponent/warehouse/warehouse.component').then(c => c.WarehouseComponent),
    },
    {

      path: 'Cwarehouse-requested',
      loadComponent: () => import('./_ClientComponent/confim-requested-warehouse/confim-requested-warehouse.component').then(c => c.ConfimRequestedWarehouseComponent),
    },
    {

      path: 'transcation',
      loadComponent: () => import('./_ClientComponent/transaction-history/transaction-history.component').then(c => c.TransactionHistoryComponent),
    },
    {

      path: 'notification',
      loadComponent: () => import('./_ClientComponent/notification/notification.component').then(c => c.NotificationComponent),
    },
    {

      path: 'CcheckInhistory',
      loadComponent: () => import('./_ClientComponent/check-inhistory/check-inhistory.component').then(c => c.CheckINhistoryComponent),
    },
    {

      path: 'Ccheckouthistory',
      loadComponent: () => import('./_ClientComponent/checkout-hodtory/checkout-hodtory.component').then(c => c.CheckoutHodtoryComponent),
    },
    {

      path: 'Cinvoices',
      loadComponent: () => import('./_ClientComponent/cinvoices/cinvoices.component').then(c => c.CinvoicesComponent),
    },
    {

      path: 'C-monthly-invoices',
      loadComponent: () => import('./_ClientComponent/monthly-invoice/monthly-invoice.component').then(c => c.MonthlyInvoiceComponent),
    },
    {

      path: 'C-warehouseCheckout-requested',
      loadComponent: () => import('./_ClientComponent/warehouserequestedcheckout/warehouserequestedcheckout.component').then(c => c.WarehouserequestedcheckoutComponent),
    },
    {

      path: 'accepted-checkout-request',
      loadComponent: () => import('./_ClientComponent/accepetd-checkout/accepetd-checkout.component').then(c => c.AccepetdCheckoutComponent),
    }
]}
];
