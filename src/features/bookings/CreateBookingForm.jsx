import { useForm } from 'react-hook-form';
import { useCreateBooking } from './useCreateBooking';
import { useCabins } from '../cabins/useCabins';
import { useGuests } from '../guests/useGuests';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { useEffect } from 'react';

function CreateBookingForm({ onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking();
  const { isLoading: isLoadingGuests, guests } = useGuests();
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState,
  } = useForm();
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const cabinId = watch('cabinId');
  const hasBreakfast = watch('hasBreakfast');
  const numGuests = watch('numGuests');
  const { errors } = formState;

  useEffect(() => {
    if (!startDate || !endDate || !cabinId) return;

    const cabin = cabins?.find((c) => c.id === Number(cabinId));
    if (!cabin) return;

    const nights =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    if (nights > 0) {
      const cabinPrice = nights * cabin.regularPrice;
      const extrasPrice = hasBreakfast ? nights * 15 * numGuests : 0;

      const total = cabinPrice + extrasPrice;

      setValue('totalPrice', total);
    }
  }, [startDate, endDate, cabinId, cabins, setValue, hasBreakfast, numGuests]);

  function onSubmit(data) {
    const cabin = cabins.find((c) => c.id === Number(data.cabinId));
    const numNights =
      (new Date(data.endDate) - new Date(data.startDate)) /
      (1000 * 60 * 60 * 24);
    const cabinPrice = numNights * cabin.regularPrice;
    const extrasPrice = data.hasBreakfast ? numNights * 15 : 0;
    const newBooking = {
      cabinId: Number(data.cabinId),
      guestId: Number(data.guestId),
      startDate: data.startDate,
      endDate: data.endDate,
      numGuests: Number(data.numGuests),
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
      status: 'unconfirmed',
      hasBreakfast: false,
      isPaid: false,
      observations: '',
    };
    createBooking(newBooking, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  function onError(errors) {
    // console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      {/* Cabin ID */}
      <FormRow label="Cabin ID" error={errors?.cabinId?.message}>
        {/* <Input
          type="number"
          id="cabinId"
          {...register('cabinId', {
            required: 'This field is required',
          })}
        /> */}
        <select
          disabled={isLoadingCabins}
          id="cabinId"
          {...register('cabinId', { required: 'This field is required' })}
        >
          <option value="">Select cabin</option>
          {cabins?.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name} (${cabin.regularPrice})
            </option>
          ))}
        </select>
      </FormRow>

      {/* Guest ID */}
      <FormRow label="Guest ID" error={errors?.guestId?.message}>
        <select
          disabled={isLoadingGuests}
          id="guestId"
          {...register('guestId', { required: 'This field is required' })}
        >
          <option value="">Select guest</option>
          {guests?.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName} ({guest.email})
            </option>
          ))}
        </select>
      </FormRow>

      {/* Start Date */}
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register('startDate', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      {/* End Date */}
      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          {...register('endDate', {
            required: 'This field is required',
            validate: (value) =>
              new Date(value) > new Date(getValues().startDate) ||
              'End date must be after start date',
          })}
        />
      </FormRow>

      {/* Guests */}
      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          {...register('numGuests', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'At least 1 guest',
            },
          })}
        />
      </FormRow>

      <FormRow label="Breakfast included?">
        <input type="checkbox" {...register('hasBreakfast')} />
      </FormRow>

      {/* Price */}
      <FormRow label="Total price" error={errors?.totalPrice?.message}>
        <Input
          type="number"
          id="totalPrice"
          disabled
          {...register('totalPrice')}
        />
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>Create booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
