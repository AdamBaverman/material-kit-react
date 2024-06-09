import { type Theme, type Keyframes, keyframes } from "@emotion/react";

export const fadeIn = (theme: Theme): Keyframes => keyframes`
  from {
    background-color: ${theme.palette.primary.light};
    }
    to {
      background-color: ${theme.palette.primary.dark};
      }
      `;

export const fadeOut = (theme: Theme): Keyframes => keyframes`
  from {
    background-color: ${theme.palette.primary.dark};
    }
    to {
      background-color: ${theme.palette.primary.light};
      }
      `;