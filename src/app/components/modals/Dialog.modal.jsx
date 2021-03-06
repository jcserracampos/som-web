import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  white, purple, black50, black,
} from '../../settings/colors';
import PrimaryButton from '../atoms/PrimaryButton';

const ModalWrapper = styled.div`
  display: ${(props) => {
    const { isOpen } = props;
    return !isOpen ? 'none' : 'flex';
  }};
  align-items: center;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 20;
  padding: 30px;
  background-color: ${black50};
`;

const Modal = styled.div`
  border-radius: 20px;
  width: 100%;
  max-width: 320px;
  overflow: hidden;
  background-color: ${white};
  text-align: left;
  color: ${black};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  padding-top: 30px; 
`;

const Icon = styled.img`
  height: 100%;
`;

const Content = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  font-size: 1.5714285714em;
  line-height: 1.1em;
  font-weight: 400;
`;

const Message = styled.h3`
  font-size: 1em;
  font-weight: 300;
  line-height: 1.625em;
  margin-top: 25px;
  margin-bottom: 25px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const BackButton = styled.a`
  margin-right: 15px;
  color: ${purple};
`;

const CloseIcon = styled.img`
  width: 22px;
  height: 22px;
  margin-top: 5px;
  margin-top: 20px;
  margin-right: 20px;
  float: right;
  cursor: pointer;
`;

const DialogModal = ({
  title, description, confirmAction,
  disagreeAction, agreeText, disagreeText,
  isOpen, closeAction,
  icon,
}) => (
  <ModalWrapper isOpen={isOpen}>
    <Modal>
      {
        closeAction
          ? (
            <CloseIcon
              color="#000"
              src="/icons/x.svg"
              alt="botão de cancelar"
              onClick={() => closeAction()}
            />
          )
          : null
      }
      <IconWrapper>
        <Icon src={icon} alt={title} />
      </IconWrapper>
      <Content>
        <Title>{title}</Title>
        <Message>
          {description}
        </Message>
        <Actions>
          {disagreeAction ? <BackButton type="button" onClick={disagreeAction}>{disagreeText}</BackButton> : null}
          {confirmAction ? <PrimaryButton type="button" onClick={confirmAction}>{agreeText}</PrimaryButton> : null}
        </Actions>
      </Content>
    </Modal>
  </ModalWrapper>
);

DialogModal.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  description: PropTypes.node,
  agreeText: PropTypes.string,
  disagreeText: PropTypes.string,
  confirmAction: PropTypes.func.isRequired,
  closeAction: PropTypes.func.isRequired,
  disagreeAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

DialogModal.defaultProps = {
  icon: '/icons/guita-error.svg',
  title: 'Title',
  description: 'Description',
  agreeText: '',
  disagreeText: '',
  isOpen: false,
};

export default DialogModal;
