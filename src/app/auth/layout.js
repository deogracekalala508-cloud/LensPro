export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
      {children}
    </div>
  );
}
