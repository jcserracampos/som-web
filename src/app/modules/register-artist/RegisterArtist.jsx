/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Store from '../../store/Store';
import StepFormHeader from '../../components/organisms/stepFormHeader.organism';
import BasicInformationFieldset from '../../components/templates/register-artist/BasicInformationFieldset';
import ContactAndSongsFieldset from '../../components/templates/register-artist/ContactAndSongsFieldset';
import FilesFieldset from '../../components/templates/register-artist/FilesFieldSet';
import SocialsFieldset from '../../components/templates/register-artist/SocialsFieldset';
import { black, white } from '../../settings/colors';
import StepFormFooter from '../../components/organisms/StepFormFooter.organism';
import {
  handleACMusicalStyle, steps, handleMusicalStyleSelect,
  fetchMusicalStyleOptions, nextAction, skipAction, uploadDocumentFile,
  fetchLocations, handleCountrySelect, handleStateSelect, deleteTag,
} from './registerArtist.controller';
import UploadSongs from '../../components/templates/register-artist/UploadSongs';
import {
  validateDescription,
  validateEmail,
  validateNumber,
  validatePhoneString,
  validateInstagramUrl,
  validateCommonString,
  validateYoutubeUrl,
  validateFacebookUrl,
  validateTwitterUrl,
} from '../../utilities/rgxValidator.utils';

const Form = styled.form`
  width: 100%;
  background-color: ${black};
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 768px;
`;

const FilesBackGround = styled.div`
  background-color: ${white};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const handleBlurChange = ({ target }, type, setErrors, currentErrors) => {
  const errors = { ...currentErrors };
  const validated = {};
  switch (type) {
    case 'common':
      validated[target.id] = validateCommonString(target.value);
      break;
    case 'number':
      validated[target.id] = validateNumber(target.value);
      break;
    case 'description':
      validated[target.id] = validateDescription(target.value);
      break;
    case 'phone':
      validated[target.id] = validatePhoneString(target.value);
      break;
    case 'email':
      validated[target.id] = validateEmail(target.value);
      break;
    case 'facebookUrl':
      validated[target.id] = validateFacebookUrl(target.value);
      break;
    case 'instagramUrl':
      validated[target.id] = validateInstagramUrl(target.value);
      break;
    case 'twitterUrl':
      validated[target.id] = validateTwitterUrl(target.value);
      break;
    case 'youtubeUrl':
      validated[target.id] = validateYoutubeUrl(target.value);
      break;
    default:
      return;
  }

  if (!validated[target.id]) {
    errors[target.id] = 'Campo inválido';
    setErrors(errors);
  } else {
    errors[target.id] = '';
    setErrors(errors);
  }
};

const renderArtistInfos = ({
  values,
  setAvatar,
  setAbout,
  artistStepErrors,
  country,
  setCity,
  deleteTag,
  states,
  setIntegrants,
  setName,
  setCountry,
  setState,
  countries,
  musicalStylesOptions,
  musicalStyles,
  setMusicalStyle,
  state,
  setMusicalStylePredict,
  setMusicalStyles,
  setArtistStepErrors,
  setStates,
}) => (
  <BasicInformationFieldset
    artistStepErrors={artistStepErrors}
    values={values}
    deleteTag={deleteTag}
    countries={countries}
    states={states}
    handleAvatarChange={({ target }) => setAvatar({
      url: URL.createObjectURL(target.files[0]),
      urls: null,
      file: target.files[0],
    })}
    country={country}
    state={state}
    handleCountrySelect={data => handleCountrySelect({ data, setStates, setCountry })}
    handleStateSelect={data => handleStateSelect({ data, setState })}
    setArtistStepErrors={setArtistStepErrors}
    handleAboutChange={({ target }) => setAbout(target.value)}
    handleCityChange={({ target }) => setCity(target.value)}
    handleBlurChange={handleBlurChange}
    handleIntegrantsChange={({ target }) => setIntegrants(target.value)}
    handleNameChange={({ target }) => setName(target.value)}
    handleCountryChange={option => setCountry(option)}
    handleStateChange={option => setState(option)}
    handleMusicalStyleChange={({ target }) => handleACMusicalStyle({
      value: target.value,
      musicalStylesOptions,
      setMusicalStylePredict,
      setMusicalStyle,
    })}
    handleMusicalStyleSelect={value => handleMusicalStyleSelect({
      value,
      musicalStylesOptions,
      musicalStyles,
      setMusicalStyle,
      setMusicalStylePredict,
      setMusicalStyles,
    })}
  />
);

const renderContacts = ({
  setPhone, setEmail, phone, setContactStepErrors, email, visibles, contactStepErrors,
}) => {
  if (!visibles.contact) return null;
  return (
    <ContactAndSongsFieldset
      setErrors={setContactStepErrors}
      handleBlurChange={handleBlurChange}
      stepErrors={contactStepErrors}
      handlePhoneChange={({ target }) => setPhone(target.value)}
      handleEmailChange={({ target }) => setEmail(target.value)}
      values={{
        phone,
        email,
        songs: [],
      }}
    />
  );
};

const renderSocialMedia = ({
  visibles,
  setFacebook,
  setInstagram,
  setTwitter,
  setYoutube,
  facebook,
  instagram,
  twitter,
  youtube,
  setSpotify,
  spotify,
  setSocialMediaStepErrors,
  socialMediaStepErrors,
}) => {
  if (!visibles.social) return null;
  return (
    <SocialsFieldset
      handleBlurChange={handleBlurChange}
      setStepErrors={setSocialMediaStepErrors}
      stepErrors={socialMediaStepErrors}
      handleFacebookChange={({ target }) => setFacebook(target.value)}
      handleInstagramChange={({ target }) => setInstagram(target.value)}
      handleTwitterChange={({ target }) => setTwitter(target.value)}
      handleYoutubeChange={({ target }) => setYoutube(target.value)}
      handleSpotifyChange={({ target }) => setSpotify(target.value)}
      values={{
        facebook,
        instagram,
        twitter,
        youtube,
        spotify,
      }}
    />
  );
};

const renderFiles = ({ visibles, artist }) => {
  if (!visibles.files || !artist) return null;
  return <FilesFieldset handleFileChange={uploadDocumentFile} artist={artist} />;
};

const renderUploadSongs = ({
  songs, setSongs, authId,
  visibles,
}) => {
  if (!visibles.files || !authId) return null;
  return <UploadSongs authId={authId} songs={songs} setSongs={setSongs} />;
};

const RegisterArtist = ({ history }) => {
  const store = useContext(Store);
  const [artistStepErrors, setArtistStepErrors] = useState({});
  const [contactStepErrors, setContactStepErrors] = useState({});
  const [socialMediaStepErrors, setSocialMediaStepErrors] = useState({});
  const [about, setAbout] = useState('');
  const [id, setId] = useState('');
  const [city, setCity] = useState('');
  const [integrants, setIntegrants] = useState('');
  const [country, setCountry] = useState({});
  const [state, setState] = useState({});
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState({});
  const [musicalStyles, setMusicalStyles] = useState([]);
  const [musicalStylesOptions, setMusicalStylesOptions] = useState([]);
  const [musicalStylePredict, setMusicalStylePredict] = useState('');
  const [musicalStyle, setMusicalStyle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [facebook, setFacebook] = useState('https://www.facebook.com/');
  const [instagram, setInstagram] = useState('https://www.instagram.com/');
  const [twitter, setTwitter] = useState('https://twitter.com/');
  const [spotify, setSpotify] = useState('');
  const [youtube, setYoutube] = useState('https://www.youtube.com/');
  const [songs, setSongs] = useState([
    /* { ...initialSong } */
  ]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [visibles, setVisibles] = useState({
    artist: true,
    music: false,
    contact: false,
    social: false,
    files: false,
  });
  const [step] = useState(2);

  useEffect(() => {
    if (!musicalStylesOptions.length) {
      fetchMusicalStyleOptions(setMusicalStylesOptions);
    }
    if (!countries.length && !states.length) {
      fetchLocations({ setCountries, setStates });
      fetchMusicalStyleOptions(setMusicalStylesOptions);
    }
  }, [musicalStylesOptions]);

  const values = {
    avatar: avatar.url,
    name,
    integrants,
    about,
    country,
    state,
    city,
    musicalStyles,
    musicalStylePredict,
    musicalStyle,
  };

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <StepFormHeader items={steps} index={step} />
      <FormWrapper>
        {renderArtistInfos({
          values,
          setAvatar,
          deleteTag: id => deleteTag({
            id,
            tags: musicalStyles,
            setTag: setMusicalStyles,
          }),
          setAbout,
          artistStepErrors,
          setCity,
          setIntegrants,
          setName,
          country,
          countries,
          setState,
          state,
          handleACMusicalStyle,
          handleMusicalStyleSelect,
          musicalStylesOptions,
          musicalStyles,
          setMusicalStyle,
          setMusicalStylePredict,
          setMusicalStyles,
          states,
          setStates,
          setCountry,
          setArtistStepErrors,
        })}
        {renderContacts({
          setPhone,
          setEmail,
          phone,
          setContactStepErrors,
          email,
          visibles,
          contactStepErrors,
        })}
        {renderSocialMedia({
          visibles,
          setFacebook,
          setInstagram,
          setTwitter,
          setYoutube,
          setSpotify,
          facebook,
          instagram,
          twitter,
          youtube,
          spotify,
          setSocialMediaStepErrors,
          socialMediaStepErrors,
        })}
      </FormWrapper>
      <FilesBackGround>
        <FormWrapper>
          {renderUploadSongs({
            authId: id,
            visibles,
            songs,
            setSongs,
          })}
          {renderFiles({ visibles, artist: id })}
        </FormWrapper>
      </FilesBackGround>
      <StepFormFooter
        nextAction={() => nextAction({
          about, city, integrants, id, setId,
          country, state, name, avatar,
          musicalStyles, musicalStylesOptions, musicalStylePredict,
          musicalStyle, phone, email, facebook, instagram,
          twitter, youtube, visibles, setVisibles,
          setArtistStepErrors, setContactStepErrors,
          songs, setSongs, store, history, setLoading, spotify, setAvatar,
        })}
        loading={loading}
        customStyle={visibles.files && id ? `background-color: ${white};` : ''}
        skipAction={() => skipAction(setVisibles, visibles)}
      />
    </Form>
  );
};

export default withRouter(RegisterArtist);
