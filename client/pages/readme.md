#### How the Next JS will authenticate request 
* ##### Inspect URL of incoming request. 
  Determine set of components to show depending on auth state.
* ##### Call those component's 'getInitialProps' static method.
  For all the components that it needs to show, it will call the getInitialProps().
* ##### Render each component with returned data.
  Render the component based on the data returned by getInitialProps().
* ##### Assemble HTML from all components and render the response.
     &nbsp;
---
