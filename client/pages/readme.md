#### NOTE : 
When you tie getInitialPRops() to _app Component, the getInitialProps() tied to 
other page components do not get invoked automatically.
#### This issue be solved by *invoking* the getInitialProps() of page components from the _app component's getInitialProps(). _app Component's getInitialProps(appContext) - *appContext object* has information about the page components getIntialProps() as well.

### How the Next JS will authenticate request?
* Inspect URL of incoming request. 
  Determine set of components to show depending on auth state.
* Call those component's 'getInitialProps' static method.
  For all the components that it needs to show, it will call the getInitialProps().
* Render each component with returned data.
  Render the component based on the data returned by getInitialProps().
* Assemble HTML from all components and render the response.
     
--- 

### How to communicate amongst services internally?
* We could either use 'http://auth-srv/api/users/currentuser'
  This would work but:
  ##### note : 
  This rule only works if the services are in the same namespace.
  ```
  kubectl get namespace
  ```
  *BUT the ingress-nginx runs in a separate 'ingress-nginx namespace'*. 
  Therefore, below point might be a challenge: 

* We could rather reach out to ingress-nginx with the path
  of '/api/users/currentuser and let ingress-nginx figure out 
  to which service in our cluster this request would belong to.
* For this, we *cannot* reach out to *ingres-nginx-service-name* directly.
* So for cross-namespace communication we will use the domain (from client):
> ##### http://name-of-service.namespace.svc.cluster.local 
Hence, we will get all these details : 
```
kubectl get namespace 
#ingress-nginx <-- namespace name
kubectl get service -n ingress-nginx
#ingress-nginx <-- service name
```
Therefore (from client -> auth via ingress-nginx): 
> ##### http://ingress-nginx.ingress-nginx.svc.cluster.local/<endpoint>

---
