// pages/admin/create.tsx
import Layout from '../../components/Layout';
import EventCreateForm from '../../components/EventCreateForm';

const CreateEventPage: React.FC = () => {
  return (
    <Layout title="Create Event - Admin">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventCreateForm />
      </div>
    </Layout>
  );
};

export default CreateEventPage;
