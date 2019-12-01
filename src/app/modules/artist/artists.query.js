import gql from 'graphql-tag';

const oneArtistQuery = gql`
  query($id: ID!){
    oneArtist(id: $id) {
      id
      name
      avatar_image {
        mimified
        thumbnail
      }
      facebook
      twitter
      instagram
      youtube
      follows {
        user {
          id
        }
      }
      spotify_artist_link
    }
  }
`;

const allSongsQuery = gql`
  query($song: SongInput) {
    allSongs(song: $song) {
      id
      url
      title
      image {
        mimified
      }
    }
  }
`;

export default { oneArtistQuery, allSongsQuery };
