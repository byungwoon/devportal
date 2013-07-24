#Custom domain names on Apigee Developer Portals

1. Create and configure the portal with the current URL structure: 

  1. PORTAL-NAME.apiportal.apigee.com & 
  1. PORTAL-NAME.apiportal.test.apigee.com

1. If you don't need https all that needs to be done is the cname entry. You don't need an ELB. If you need a custom certificate for your url, the customer needs to supply it and an ELB must be procured.

1. Create a support ticket to add an enterprise load balancer (ELB) for the URL you wish to use ( e.g. blah.myurl.com ). Give ops your portal name and they will create an ELB that will point to the cluster on which your portal is hosted.

1. Supply apigee ops a certificate for the new url. They will install it in the ELB and make "https://" work.

1. Ops will edit the instance in Shiva and add the cname. Then rewrite the sites.php in the buckets to make drupal aware of the new hostname