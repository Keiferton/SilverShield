import {
  ArrowUp,
  Download,
  FileText,
  Flag,
  Gift,
  Info,
  KeyRound,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Phone,
  PhoneCall,
  PhoneOff,
  Plus,
  Reply,
  Trash2,
  UserRound,
  UsersRound,
  Volume2,
  X,
} from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime.js';
import { formatClockTime, formatMessageTimestamp } from '../utils/dateTime.js';

function getNativeChoice(event, nativeActions) {
  const actions = Array.isArray(nativeActions) ? nativeActions : [nativeActions];
  const options = event.options ?? event.choices ?? [];

  return options.find((choice) =>
    actions.some((action) => choice.nativeAction === action || choice.nativeActionAliases?.includes(action)),
  );
}

function NativeActionButton({
  event,
  nativeAction,
  nativeActions,
  onAnswer,
  disabled = false,
  className = '',
  children,
  ariaLabel,
}) {
  const choice = getNativeChoice(event, nativeActions ?? nativeAction);
  const inactive = disabled || !choice;

  return (
    <button
      type="button"
      disabled={inactive}
      aria-label={ariaLabel}
      onClick={() => choice && onAnswer?.(choice.id)}
      className={`${className} transition duration-150 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-default disabled:opacity-60 disabled:active:scale-100`}
    >
      {children}
    </button>
  );
}

function ContactAction({ event, nativeAction, disabled, onAnswer, icon: Icon, label }) {
  return (
    <NativeActionButton
      event={event}
      nativeAction={nativeAction}
      disabled={disabled}
      onAnswer={onAnswer}
      className="flex min-w-14 flex-col items-center gap-1 text-xs font-semibold text-blue-700"
      ariaLabel={label}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
        <Icon size={18} strokeWidth={2.25} />
      </span>
      <span>{label}</span>
    </NativeActionButton>
  );
}

function MailToolbarButton({ event, nativeAction, disabled, onAnswer, icon: Icon, label }) {
  return (
    <NativeActionButton
      event={event}
      nativeAction={nativeAction}
      disabled={disabled}
      onAnswer={onAnswer}
      className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700"
      ariaLabel={label}
    >
      <Icon size={18} strokeWidth={2.1} />
      <span>{label}</span>
    </NativeActionButton>
  );
}

function FacebookAction({ event, nativeAction, disabled, onAnswer, icon: Icon, label, className = '' }) {
  return (
    <NativeActionButton
      event={event}
      nativeAction={nativeAction}
      disabled={disabled}
      onAnswer={onAnswer}
      className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ${className}`}
      ariaLabel={label}
    >
      <Icon size={17} strokeWidth={2.15} />
      <span>{label}</span>
    </NativeActionButton>
  );
}

function PhoneControl({ event, nativeAction, nativeActions, disabled, onAnswer, icon: Icon, label, danger = false }) {
  return (
    <NativeActionButton
      event={event}
      nativeAction={nativeAction}
      nativeActions={nativeActions}
      disabled={disabled}
      onAnswer={onAnswer}
      className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-200"
      ariaLabel={label}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ${
          danger ? 'bg-red-600 text-white ring-red-400' : 'bg-white/12 text-white ring-white/10'
        }`}
      >
        <Icon size={21} strokeWidth={2.1} />
      </span>
      <span>{label}</span>
    </NativeActionButton>
  );
}

function MessagePreview({ event, disabled, onAnswer }) {
  const now = useCurrentTime();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
      <div className="mb-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-300 text-2xl font-semibold text-slate-700">
          {event.sender.charAt(0)}
        </div>
        <p className="mt-2 text-base font-semibold text-slate-950">{event.sender}</p>
        {event.senderDetail && <p className="mt-1 text-sm font-semibold text-slate-500">{event.senderDetail}</p>}
        <div className="mt-3 flex justify-center gap-5">
          <ContactAction event={event} nativeAction="call_bank" disabled={disabled} onAnswer={onAnswer} icon={Phone} label="Audio" />
          <span className="flex min-w-14 flex-col items-center gap-1 text-xs font-semibold text-blue-700">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <Info size={18} strokeWidth={2.25} />
            </span>
            Info
          </span>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">{formatMessageTimestamp(now)}</p>
      </div>
      <div className="flex flex-col items-start">
        <div className="max-w-[86%] break-words rounded-[1.25rem] rounded-bl-md bg-slate-200 px-4 py-3 text-lg leading-8 text-slate-950 shadow-sm">
          {event.body}
        </div>
        <NativeActionButton
          event={event}
          nativeAction="open_link"
          disabled={disabled}
          onAnswer={onAnswer}
          className="mt-2 max-w-[86%] overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200"
          ariaLabel="Open message link preview"
        >
          <span className="block h-16 bg-slate-100 px-4 py-3">
            <span className="block truncate text-sm font-semibold text-slate-600">
              {event.linkPreviewTitle ?? 'Link preview hidden'}
            </span>
            <span className="mt-1 block truncate text-xs font-semibold text-slate-500">
              {event.linkPreviewSubtitle ?? 'Unknown sender link or request'}
            </span>
          </span>
          <span className="block border-t border-slate-200 px-4 py-3">
            <span className="block truncate text-sm font-bold text-blue-700">{event.sender}</span>
          </span>
        </NativeActionButton>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <NativeActionButton
          event={event}
          nativeAction="report_junk"
          disabled={disabled}
          onAnswer={onAnswer}
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm"
        >
          Report Junk
        </NativeActionButton>
        <NativeActionButton
          event={event}
          nativeAction="block_sender"
          disabled={disabled}
          onAnswer={onAnswer}
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
        >
          Block
        </NativeActionButton>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
          <Plus size={18} strokeWidth={2.2} />
        </span>
        <span className="flex-1 text-left text-base font-semibold text-slate-400">iMessage</span>
        <NativeActionButton
          event={event}
          nativeAction="reply"
          disabled={disabled}
          onAnswer={onAnswer}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white"
          ariaLabel="Send message"
        >
          <ArrowUp size={18} strokeWidth={2.6} />
        </NativeActionButton>
      </div>
    </div>
  );
}

function EmailPreview({ event, disabled, onAnswer }) {
  const now = useCurrentTime();
  const fromAddress = event.fromAddress ?? event.sender;
  const attachmentLabel = event.assetLabel ?? 'Open secure message';

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white">
      <div className="border-b border-slate-200 bg-[#f8f8fb] px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-blue-700">Inbox</p>
          <p className="text-sm font-bold text-slate-500">1 of 1</p>
        </div>
        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">From</p>
        <div className="flex items-start justify-between gap-3">
          <p className="break-words text-lg font-semibold text-slate-950">{fromAddress}</p>
          <p className="shrink-0 text-sm font-bold text-slate-500">{formatClockTime(now)}</p>
        </div>
      </div>
      <div className="px-4 py-5">
        <h2 className="break-words text-3xl font-semibold leading-tight text-slate-950">{event.title}</h2>
        <div className="mt-3 flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700">
            {event.sender.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-950">{event.sender}</p>
            <p className="truncate text-sm font-semibold text-slate-500">{fromAddress}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-500">Email message</p>
          <p className="mt-2 text-lg leading-8 text-slate-800">{event.body}</p>
        </div>
        <NativeActionButton
          event={event}
          nativeActions={['open_attachment', 'open_link']}
          disabled={disabled}
          onAnswer={onAnswer}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm"
          ariaLabel="Open email attachment or link"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileText size={21} strokeWidth={2.1} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-800">{attachmentLabel}</span>
            <span className="mt-1 block text-xs font-semibold text-slate-500">Message attachment or link</span>
          </span>
        </NativeActionButton>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <span className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700">
            <FileText size={18} strokeWidth={2.1} />
            Archive
          </span>
          <MailToolbarButton event={event} nativeAction="delete_email" disabled={disabled} onAnswer={onAnswer} icon={Trash2} label="Delete" />
          <MailToolbarButton event={event} nativeAction="reply" disabled={disabled} onAnswer={onAnswer} icon={Reply} label="Reply" />
          <MailToolbarButton event={event} nativeAction="forward_email" disabled={disabled} onAnswer={onAnswer} icon={MoreHorizontal} label="More" />
        </div>
      </div>
    </div>
  );
}

function FacebookPreview({ event, disabled, onAnswer }) {
  const now = useCurrentTime();
  const isMarketplace = event.category === 'Marketplace payment scam';

  if (isMarketplace) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f0f2f5] p-3">
        <div className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
          <span className="text-lg font-semibold text-[#1877f2]">f</span>
          <span className="text-base font-semibold text-slate-500">Marketplace</span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-br from-slate-200 to-slate-300 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700">{event.listingTitle ?? 'Item listing'}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{event.listingDetail ?? 'Local pickup'}</p>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-slate-500">Buyer message</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-700">
                {event.sender.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950">{event.sender}</p>
                <p className="text-sm font-semibold text-slate-500">{event.senderDetail ?? formatClockTime(now)}</p>
              </div>
            </div>
            <p className="mt-3 rounded-2xl bg-slate-100 p-4 text-lg leading-8 text-slate-800">{event.body}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <FacebookAction
                event={event}
                nativeAction="view_profile"
                disabled={disabled}
                onAnswer={onAnswer}
                icon={UserRound}
                label="View Profile"
                className="bg-blue-50 text-[#1877f2]"
              />
              <FacebookAction
                event={event}
                nativeAction="report_profile"
                disabled={disabled}
                onAnswer={onAnswer}
                icon={Flag}
                label="Report Buyer"
                className="bg-blue-50 text-[#1877f2]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f0f2f5] p-3">
      <div className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
        <span className="text-lg font-semibold text-[#1877f2]">f</span>
        <span className="text-base font-semibold text-slate-500">Search Facebook</span>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-800">
            {event.sender.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-950">{event.sender}</p>
            <p className="text-sm font-semibold text-slate-500">
              {event.senderDetail ? `${event.senderDetail} - ${formatClockTime(now)}` : `Message request - ${formatClockTime(now)}`}
            </p>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-950">{event.title}</h2>
        <p className="mt-3 rounded-2xl bg-slate-100 p-4 text-lg leading-8 text-slate-800">{event.body}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-center">
          <FacebookAction
            event={event}
            nativeAction="view_profile"
            disabled={disabled}
            onAnswer={onAnswer}
            icon={UserRound}
            label="Profile"
            className="text-slate-600"
          />
          <FacebookAction
            event={event}
            nativeAction="message_profile"
            disabled={disabled}
            onAnswer={onAnswer}
            icon={MessageCircle}
            label="Message"
            className="text-slate-600"
          />
          <FacebookAction
            event={event}
            nativeAction="report_profile"
            disabled={disabled}
            onAnswer={onAnswer}
            icon={Flag}
            label="Report"
            className="text-slate-600"
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <FacebookAction
            event={event}
            nativeAction="call_family"
            disabled={disabled}
            onAnswer={onAnswer}
            icon={UsersRound}
            label="Call Family"
            className="bg-blue-50 text-[#1877f2]"
          />
          <FacebookAction
            event={event}
            nativeAction="send_gift_cards"
            disabled={disabled}
            onAnswer={onAnswer}
            icon={Gift}
            label="Gift Card"
            className="bg-slate-100 text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

function BrowserPreview({ event, disabled, onAnswer }) {
  const isOfficialReportPage = event.category === 'Legitimate safety resource';

  if (isOfficialReportPage) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
        <div className="border-b border-slate-300 bg-slate-200 p-3">
          <NativeActionButton
            event={event}
            nativeActions={['type_gov_site', 'continue_reading']}
            disabled={disabled}
            onAnswer={onAnswer}
            className="w-full break-words rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-slate-700 shadow-inner"
          >
            {event.url ?? event.sender}
          </NativeActionButton>
        </div>
        <div className="p-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="bg-blue-700 px-4 py-5 text-white">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-100">{event.siteTitle ?? 'USA.gov'}</p>
              <h2 className="mt-2 text-3xl font-semibold">Report Scams</h2>
            </div>
            <div className="p-4">
              <p className="text-sm font-bold text-blue-700">Official guidance</p>
              <p className="mt-2 text-lg leading-8 text-slate-800">{event.body}</p>
              <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Page checks</p>
                <div className="mt-3 space-y-2 text-base font-semibold text-slate-800">
                  <p>Address ends in .gov</p>
                  <p>No gift card or crypto payment request</p>
                  <p>No bank password fields</p>
                </div>
              </div>
              <NativeActionButton
                event={event}
                nativeActions={['continue_reading', 'type_gov_site']}
                disabled={disabled}
                onAnswer={onAnswer}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white"
              >
                <Info size={19} strokeWidth={2.2} />
                Learn Where To Report
              </NativeActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
      <div className="border-b border-slate-300 bg-slate-200 p-3">
        <div className="break-words rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-slate-700 shadow-inner">
          {event.url ?? event.sender}
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-red-600 px-4 py-3 text-base font-semibold text-white">Critical Security Alert</div>
          <div className="p-4">
            <p className="text-sm font-bold uppercase tracking-wide text-red-700">Warning</p>
            <h2 className="mt-1 break-words text-2xl font-semibold text-red-950">{event.title}</h2>
            <p className="mt-3 text-lg leading-8 text-slate-900">{event.body}</p>
            <div className="mt-4 rounded-2xl bg-red-50 p-3 text-center">
              <p className="text-4xl font-semibold text-red-700">12</p>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Threats found</p>
            </div>
            <NativeActionButton
              event={event}
              nativeAction="call_number"
              disabled={disabled}
              onAnswer={onAnswer}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-base font-semibold text-white"
            >
              <PhoneCall size={19} strokeWidth={2.2} />
              Call Support Now
            </NativeActionButton>
            <NativeActionButton
              event={event}
              nativeAction="download_cleaner"
              disabled={disabled}
              onAnswer={onAnswer}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white"
            >
              <Download size={19} strokeWidth={2.2} />
              Download Cleaner
            </NativeActionButton>
          </div>
        </div>
        <div className="mt-3 flex justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
          <NativeActionButton
            event={event}
            nativeAction="close_tab"
            disabled={disabled}
            onAnswer={onAnswer}
            className="flex items-center gap-1 rounded-xl px-2"
          >
            <X size={16} strokeWidth={2.2} />
            Close
          </NativeActionButton>
          <span>Tabs</span>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

function PhonePreview({ event, disabled, onAnswer }) {
  const now = useCurrentTime();
  const seconds = now.getSeconds();
  const callDuration = `00:${String(Math.max(seconds, 8)).padStart(2, '0')}`;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-slate-950 px-5 py-6 text-center text-white">
      <p className="text-base font-semibold text-slate-300">Active call - {formatClockTime(now)}</p>
      <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-4xl font-semibold shadow-lg">
        {event.sender.charAt(0)}
      </div>
      <h2 className="mt-4 break-words text-3xl font-semibold">{event.sender}</h2>
      {event.callerDetail && <p className="mt-1 text-base font-semibold text-slate-400">{event.callerDetail}</p>}
      <p className="mt-1 text-base font-semibold text-slate-300">{callDuration}</p>

      <div className="mt-5 rounded-[1.5rem] bg-white/10 p-4 text-left shadow-inner">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Live transcript</p>
        <p className="mt-2 text-lg leading-8">{event.body}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <PhoneControl event={event} nativeAction="share_private_info" disabled={disabled} onAnswer={onAnswer} icon={KeyRound} label="Number" />
        <PhoneControl event={event} nativeAction="confirm_info" disabled={disabled} onAnswer={onAnswer} icon={Info} label="Confirm" />
        <PhoneControl
          event={event}
          nativeActions={['call_back', 'call_official']}
          disabled={disabled}
          onAnswer={onAnswer}
          icon={PhoneCall}
          label="Call Back"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <span className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-200">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/10">
            <Mic size={21} strokeWidth={2.1} />
          </span>
          Mute
        </span>
        <span className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-200">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/10">
            <KeyRound size={21} strokeWidth={2.1} />
          </span>
          Keypad
        </span>
        <span className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-200">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/10">
            <Volume2 size={21} strokeWidth={2.1} />
          </span>
          Speaker
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <PhoneControl event={event} nativeAction="end_call" disabled={disabled} onAnswer={onAnswer} icon={PhoneOff} label="End" danger />
      </div>
    </div>
  );
}

export default function ScenarioPreview({ event, disabled = false, onAnswer }) {
  if (event.channel === 'messages') {
    return <MessagePreview event={event} disabled={disabled} onAnswer={onAnswer} />;
  }

  if (event.channel === 'email') {
    return <EmailPreview event={event} disabled={disabled} onAnswer={onAnswer} />;
  }

  if (event.channel === 'facebook') {
    return <FacebookPreview event={event} disabled={disabled} onAnswer={onAnswer} />;
  }

  if (event.channel === 'browser') {
    return <BrowserPreview event={event} disabled={disabled} onAnswer={onAnswer} />;
  }

  if (event.channel === 'phone') {
    return <PhonePreview event={event} disabled={disabled} onAnswer={onAnswer} />;
  }

  return null;
}
