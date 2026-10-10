import { CreateBetForm } from '../components/create-bet-form';
import { pageClass, pageTitleClass } from '../components/styles';

export default function CreateBetPage() {
  return (
    <div className={`${pageClass} max-w-xl`}>
      <h1 className={pageTitleClass}>Wette erstellen</h1>
      <div className="mt-12">
        <CreateBetForm />
      </div>
    </div>
  );
}
