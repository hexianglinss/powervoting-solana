import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import EllipsisMiddle from "../../components/EllipsisMiddle";
import MDEditor from '../../components/MDEditor';
import {
  web3AvatarUrl,
  COMPLETED_STATUS,
  WRONG_NET_STATUS
} from "../../common/consts";
import VoteList from "../../components/VoteList";

const VotingResults = () => {
  const { id, cid } = useParams();
  const { state } = useLocation() || null;
  const [votingData, setVotingData] = useState(state);

  useEffect(() => {
    initState()
  }, [])

  const initState = async () => {
    const res = await axios.get(`https://${cid}.ipfs.nftstorage.link/`);
    const data = res.data;
    const option: any[] = [];
    let voteList: any[] = [];
    let voteStatus = null;

    if (1) {
      voteStatus = WRONG_NET_STATUS;
    } else {
      // const res = await apolloClient(chain?.id || filecoinMainnetChain.id).query({
      //   query: VOTE_QUERY,
      //   variables: {
      //     id: id
      //   }
      // })
      // const voteData = res.data.proposal;
      // if (voteData?.status === COMPLETED_STATUS) {
      //   voteStatus = COMPLETED_STATUS;
      //   data.option?.map((item: string, index: number) => {
      //     const voteItem = voteData?.voteResults?.find((vote: any) => vote.optionId === index.toString());
      //     option.push({
      //       name: item,
      //       count: voteItem?.votes ? Number(voteItem.votes) : 0
      //     })
      //   })
      //   if (voteData.voteListCid) {
      //     const res = await axios.get(`https://${voteData.voteListCid}.ipfs.nftstorage.link/`);
      //     res.data?.map(((item: any) => {
      //       voteList.push({
      //         label: data.option[item.OptionId],
      //         value: item.Votes,
      //         Address: item.Address.slice(0, -3),
      //         TransactionHash: item.TransactionHash
      //       })
      //     }))
      //   }
      // }
    }
    setVotingData({
      ...data,
      id,
      cid,
      option,
      voteStatus,
      voteList: voteList.sort((a: any, b: any) => b.value - a.value)
    })
  }

  const handleVoteStatusTag = (status: number) => {
    switch (status) {
      case WRONG_NET_STATUS:
        return {
          name: 'Wrong network',
          color: 'bg-red-700',
        };
      case COMPLETED_STATUS:
        return {
          name: 'Completed',
          color: 'bg-[#6D28D9]',
        };
      default:
        return {
          name: '',
          color: '',
        };
    }
  }

  return (
    <div className='flex voting-result'>
      <div className='relative w-full pr-4 lg:w-8/12'>
        <div className='px-3 mb-6 md:px-0'>
          <button>
            <div className='inline-flex items-center gap-1 text-skin-text hover:text-skin-link'>
              <Link to='/' className='flex items-center'>
                <svg className='mr-1' viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m11 17l-5-5m0 0l5-5m-5 5h12"></path></svg>
                Back
              </Link>
            </div>
          </button>
        </div>
        <div className='px-3 md:px-0'>
          <h1 className='mb-6 text-3xl font-semibold text-white break-words break-all leading-12'>
            {votingData?.Name}
          </h1>
          {
            votingData?.voteStatus &&
            <div className="flex justify-between mb-6">
              <div className="flex items-center justify-between w-full mb-1 sm:mb-0">
                <button
                  className={`${handleVoteStatusTag(votingData.voteStatus).color} bg-[#6D28D9] h-[26px] px-[12px] text-white rounded-xl mr-4`}>
                  {handleVoteStatusTag(votingData.voteStatus).name}
                </button>
                <div className="flex items-center justify-center">
                  <img className="w-[20px] h-[20px] rounded-full mr-2" src={`${web3AvatarUrl}:${votingData?.Address}`} alt="" />
                  <a
                    className="text-white"
                    target="_blank"
                    rel="noopener"
                    // href={`${chain?.blockExplorers?.default.url}/address/${votingData?.Address}`}
                  >
                    {EllipsisMiddle({ suffixCount: 4, children: votingData?.Address })}
                  </a>
                </div>
              </div>
            </div>
          }
          <div className='MDEditor mb-8'>
            <MDEditor
              className="border-none rounded-[16px] bg-transparent"
              style={{ height: 'auto' }}
              value={votingData?.Descriptions}
              moreButton
              readOnly={true}
              view={{ menu: false, md: false, html: true, both: false, fullScreen: true, hideMenu: false }}
              onChange={() => {}}
            />
          </div>
          <VoteList voteList={votingData?.voteList} chain={1} />
        </div>
      </div>
      <div className='w-full lg:w-4/12 lg:min-w-[321px]'>
        <div className='mt-4 space-y-4 lg:mt-0'>
          <div className='text-base border-solid border-y border-skin-border bg-skin-block-bg md:rounded-xl md:border'>
            <div className='group flex h-[57px] justify-between rounded-t-none border-b border-skin-border border-solid px-4 pb-[12px] pt-3 md:rounded-t-lg'>
              <h4 className='flex items-center text-xl'>
                <div>Message</div>
              </h4>
              <div className='flex items-center'>

              </div>
            </div>
            <div className='p-4 leading-6 sm:leading-8'>
              <div className='space-y-1'>
                <div>
                  <b>Vote Type</b>
                  <span className='float-right text-white'>{ ['Single', 'Multiple'][votingData?.VoteType - 1] } Choice Voting</span>
                </div>
                <div>
                  <b>Exp. Time</b>
                  <span className='float-right text-white'>{dayjs(votingData?.showTime).format('MMM.D, YYYY, h:mm A')}</span>
                </div>
                <div>
                  <b>Exp. Timezone</b>
                  <span className='float-right text-white'>{votingData?.GMTOffset}</span>
                </div>
                <div>
                  <b>Snapshot</b>
                  <span className="float-right text-white">Takes At Exp. Time</span>
                </div>
              </div>
            </div>
          </div>
          {
            votingData?.voteStatus === COMPLETED_STATUS &&
              <div className='text-base border-solid border-y border-skin-border bg-skin-block-bg md:rounded-xl md:border'>
                  <div className='group flex h-[57px] justify-between rounded-t-none border-b border-skin-border border-solid px-4 pb-[12px] pt-3 md:rounded-t-lg'>
                      <h4 className='flex items-center text-xl'>
                          <div>Results</div>
                      </h4>
                      <div className='flex items-center' />
                  </div>
                  <div className='p-4 leading-6 sm:leading-8'>
                      <div className='space-y-3'>
                        {
                          votingData?.option?.map((item: any, index: number) => {
                            const total = votingData?.option.reduce(((acc: number, current: any) => acc + current.count), 0);
                            const percent = item.count ? ((item.count / total) * 100).toFixed(2) : 0;
                            return (
                              <div key={item.name + index}>
                                <div className='flex justify-between mb-1 text-skin-link'>
                                  <div className='w-[150px] flex items-center overflow-hidden'>
                                    <span className='mr-1 truncate'>{item.name}</span>
                                  </div>
                                  <div className='flex justify-end'>
                                    <div className='space-x-2'>
                                      <span className='whitespace-nowrap'>{item.count} Vote(s)</span>
                                      <span>{percent}%</span>
                                    </div>
                                  </div>
                                </div>
                                <div className='relative h-2 rounded bg-[#273141]'>
                                  {
                                    item.count ?
                                      <div
                                        className='absolute top-0 left-0 h-full rounded bg-[#384AFF]'
                                        style={{
                                          width: `${percent}%`
                                        }}
                                      /> :
                                      <div
                                        className='absolute top-0 left-0 h-full rounded bg-[#273141]'
                                        style={{
                                          width: '100%'
                                        }}
                                      />
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                  </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default VotingResults
