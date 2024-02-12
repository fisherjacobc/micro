import { useQuery } from '@urql/preact';
import type { FC } from 'react';
import { Fragment } from 'react';
import { graphql } from '../../@generated/gql';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { Card } from '../../components/card';
import { Error } from '../../components/error';
import { Toggle } from '../../components/toggle';
import { useQueryState } from '../../hooks/useQueryState';
import { FileCard } from './cards/file-card';
import { PasteCard } from './cards/paste-card';
import { PageLoader } from '../../components/page-loader';

const GetFilesQuery = graphql(`
  query GetFiles($after: String) {
    user {
      files(first: 24, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            ...FileCard
          }
        }
      }
    }
  }
`);

const GetPastesQuery = graphql(`
  query GetPastes($after: String) {
    user {
      pastes(first: 24, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            ...PasteCard
          }
        }
      }
    }
  }
`);

export const FileList: FC = () => {
  const [filter, setFilter] = useQueryState('filter', 'files');
  const [files, filesFetchMore] = useQuery({ query: GetFilesQuery, pause: filter !== 'files' });
  const [pastes, pastesFetchMore] = useQuery({ query: GetPastesQuery, pause: filter !== 'pastes' });
  const source = filter === 'files' ? files : pastes;
  const fetchMore = filter === 'files' ? filesFetchMore : pastesFetchMore;
  if (source.error) {
    return <Error error={source.error} />;
  }

  const currentPageInfo = filter === 'files' ? files.data?.user.files : pastes.data?.user.pastes;
  const hasContent = currentPageInfo?.edges[0];
  const hasNextPage = currentPageInfo?.pageInfo.hasNextPage;

  return (
    <Fragment>
      <div className="flex justify-between gap-2 mb-6">
        <div>
          <Breadcrumbs href="/">Home</Breadcrumbs>
          <h2 className="capitalize font-bold text-2xl">My {filter}</h2>
        </div>
        <div>
          <Toggle
            selected={filter}
            onChange={({ value }) => setFilter(value)}
            options={[
              {
                label: 'Files',
                value: 'files',
              },
              {
                label: 'Pastes',
                value: 'pastes',
              },
            ]}
          />
        </div>
      </div>
      <div className="pb-5">
        {!source.data && <PageLoader />}
        {filter === 'files' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {files.data?.user.files.edges.map(({ node }) => <FileCard key={node.id} file={node} />)}
          </div>
        )}
        {filter === 'pastes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastes.data?.user.pastes.edges.map(({ node }) => <PasteCard key={node.id} paste={node} />)}
          </div>
        )}
        {!source.fetching && !hasContent && (
          <Card className="text-gray-500">
            You haven&apos;t uploaded anything yet. Once you upload something, it will appear here.
          </Card>
        )}
      </div>
      {hasNextPage && (
        <button
          className="w-full bg-dark-200 px-2 py-2 text-gray-500 hover:bg-dark-300 transition"
          type="button"
          onClick={() => {
            fetchMore({
              variables: {
                after: currentPageInfo.pageInfo.endCursor,
              },
            });
          }}
        >
          Load More
        </button>
      )}
    </Fragment>
  );
};
