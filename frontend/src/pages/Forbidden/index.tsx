import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';

// Shown by ProtectedRoute when an authenticated user's role isn't in a route's allowedRoles list.
// Distinct from NotFound (404) — the route exists, the user just isn't permitted to see it.
const Forbidden: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-6">
      <EmptyState
        icon={<ShieldAlert className="h-6 w-6" />}
        title="403 — Access denied"
        description="Your account doesn't have permission to view this page."
        action={
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Forbidden;
