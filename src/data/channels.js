export const channels = [
  {
    id: 'messages',
    label: 'Messages',
    icon: 'messages',
    iconClass: 'bg-[#34c759] text-white',
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'mail',
    iconClass: 'bg-[#0a84ff] text-white',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    iconClass: 'bg-[#1877f2] text-white',
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: 'browser',
    iconClass: 'bg-[#f5f5f7] text-white',
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: 'phone',
    iconClass: 'bg-[#30d158] text-white',
  },
];

export function getChannelLabel(channelId) {
  return channels.find((channel) => channel.id === channelId)?.label ?? channelId;
}
