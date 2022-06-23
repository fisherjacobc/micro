import type { Meta, Story } from '@storybook/react';
import type { InputProps } from './input';
import { Input } from './input';

export default {
  component: Input,
  title: 'Components/Input',
  args: {
    placeholder: 'Placeholder',
  },
} as Meta<InputProps>;

const Template: Story<InputProps> = (props) => <Input {...props} />;

export const Default = Template.bind({});

export const WithText = Template.bind({});
WithText.args = { defaultValue: 'Some text' };
