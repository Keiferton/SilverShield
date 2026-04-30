import StatusBar from './StatusBar.jsx';
import HomeIndicator from './HomeIndicator.jsx';

export default function PhoneShell({ children }) {
  return (
    <section className="relative box-border h-[780px] max-h-[92vh] w-full max-w-[392px] overflow-hidden rounded-[3rem] border-[10px] border-[#0b0d12] bg-[#0b0d12] shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
      <StatusBar />
      <div className="h-[calc(100%-44px)] overflow-hidden bg-[#f5f5f7] pb-4">{children}</div>
      <HomeIndicator />
    </section>
  );
}
