export const dynamic = 'force-dynamic';
import LoginForm from "@/components/auth/LoginForm";
import Container from "@/components/container";

const Login = () => {
  return (
    <Container>
      <div className="md:w-2xl mx-auto">
        <LoginForm />
      </div>
    </Container>
  );
};
export default Login;
