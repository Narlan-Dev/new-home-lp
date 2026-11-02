// material-ui
import { Theme, ThemeOptions } from '@mui/material/styles';

// project-imports
import Accordion from './Accordion';
import Button from './Button';
import Dialog from './Dialog';
import Link from './Link';
import OutlinedInput from './OutlinedInput';
import Typography from './Typography';

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides(theme: Theme): ThemeOptions['components'] {
  return Object.assign({}, Accordion(theme), Button(theme), Dialog(theme), Link(theme), OutlinedInput(theme), Typography());
}
