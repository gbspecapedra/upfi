import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../services/api';

import REGEX from '../../utils/regex';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'File is required',
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'Must be less than 10MB',
        acceptedFormats: fileList =>
          REGEX.ACCEPTED_FORMATS.test(fileList[0].type) ||
          'PNG, JPEG and GIF formats accepted',
      },
    },
    title: {
      required: 'Title is required',
      minLength: {
        value: 2,
        message: 'Minimum length of 2 characters',
      },
      maxLength: {
        value: 20,
        message: 'Maximum of 20 characters',
      },
    },
    description: {
      required: 'Description is required',
      maxLength: {
        value: 65,
        message: 'Maximum length of 65 characters',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: ImageData) => {
      await api.post('/api/images', {
        ...image,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
    trigger,
  } = useForm();

  const onSubmit = async (data: ImageData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Failed to upload an image',
          description: 'Must await finish uploading before registering!',
        });
      }

      await mutation.mutateAsync(data);

      toast({
        status: 'success',
        title: 'Image uploaded',
        description: 'Your image was uploaded successfully!',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Failed to upload an image',
        description: 'Occur an error when trying to upload your image!',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Title"
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Description"
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Upload
      </Button>
    </Box>
  );
}
