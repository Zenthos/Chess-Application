import styled, { keyframes } from 'styled-components';
import { fadeIn } from 'react-animations';

const FadeIn = styled.div`animation: 1s ${keyframes`${fadeIn}`}`;

export default FadeIn;
