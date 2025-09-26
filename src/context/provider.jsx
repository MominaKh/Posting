// context/Providers.jsx
import { AuthProvider } from "./auth"
// import { CommunityProvider } from "./community"
// import { PostProvider } from "./post"

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      {/* <CommunityProvider> */}
        {/* <PostProvider> */}
          {children}
        {/* </PostProvider> */}
      {/* </CommunityProvider> */}
    </AuthProvider>
  );
};

export default AppProviders;
