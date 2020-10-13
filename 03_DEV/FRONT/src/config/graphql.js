import gql from 'graphql-tag'

export const GET_CONTINENTS = gql`
  query getContinents {
    continents {
      name
      code,
      countries {
        code
      }
    }
  }
`;

export const GET_MAP = gql`
  query getMap {
    continents {
      name
      code,
      countries {
        code
        name
        emoji
      }
    }
  }
`;

export const GET_CONTINENT = gql`
  query getContinent($code: ID!) {
    continent(code: $code) {
      code
      name
      countries {
        code
        name
        native
        emoji
        languages {
          name
          native
        }
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query getCountry($code: ID!) {
    country(code: $code) {
      name
      code
      native
      phone
      capital
      emoji
      continent {
        name
        code
        countries {
          code
          name
          native
          emoji
        }
      }
      currency
      states {
        name
      }
      languages {
        name
      }
    }
  }

`;
