export const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZERTcyMURDYzgzNTdkQURkZTRiMWU3ODdhZTg5MDhiMDA0RTkwNGIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MDk0Nzc1ODU3NCwibmFtZSI6InBvd2Vydm90aW5nIn0.rwczQpqkJ_NGguD26gGpQOjLaS9Mz6p7XmBYdbFe4f8';
export const PROGRAM_ID = '7L49xLdTLLF3HL41PUpXsCbmuS7hUFvErF8FHNoVgxoK';
export const IN_PROGRESS_STATUS = 0;
export const COMPLETED_STATUS = 1;
export const VOTE_CANCEL_STATUS = 2;
export const VOTE_COUNTING_STATUS = 3;
export const VOTE_ALL_STATUS = 4;
export const WRONG_NET_STATUS = 5;
export const VOTE_LIST: any[] = [
  {
    value: IN_PROGRESS_STATUS,
    color: 'bg-green-700',
    label: 'In Progress'
  },
  {
    value: VOTE_COUNTING_STATUS,
    color: 'bg-yellow-700',
    label: 'Vote Counting'
  },
  {
    value: COMPLETED_STATUS,
    color: 'bg-[#6D28D9]',
    label: 'Completed'
  },
]

export const VOTE_FILTER_LIST = [
  {
    label: "All",
    value: VOTE_ALL_STATUS
  },
  {
    label: "In Progress",
    value: IN_PROGRESS_STATUS
  },
  {
    label: "Vote Counting",
    value: VOTE_COUNTING_STATUS
  },
  {
    label: "Completed",
    value: COMPLETED_STATUS
  }
];

export const SINGLE_VOTE = 1;
export const MULTI_VOTE = 2;
export const VOTE_TYPE_OPTIONS = [
  {
    label: 'Single Answer',
    value: SINGLE_VOTE
  },
  {
    label: 'Multiple Answers',
    value: MULTI_VOTE
  }
];
export const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const web3AvatarUrl = 'https://cdn.stamp.fyi/avatar/eth';
