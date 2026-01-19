//@ts-ignore
import { model, Schema } from 'mongoose';
import { TCurrency } from '../../enums/payment';
import { TPaymentStatus, TTransactionFor } from './paymentTransaction.constant';
import { IPaymentTransaction } from './paymentTransaction.interface';


const paymentTransactionSchema = new Schema<IPaymentTransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        referenceFor: {
            type: String,
            enum: [
                TTransactionFor.Order,
            ],
            required: true
        },
        referenceId: {
            type: Schema.Types.ObjectId, ref: 'Order',
            required: true
        },
        transactionId: {
            type: String,
            default: null,
        },
        paymentIntent: {
            type: String,
            default: null,
        },
        amount: {
            type: Number,
            required: true,
            min: [0, 'Amount must be greater than zero']
        },
        currency: {
            type: String,
            enum: [TCurrency.usd],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: [
                TPaymentStatus.pending,
                TPaymentStatus.completed,
                TPaymentStatus.failed,
                TPaymentStatus.cancelled,
            ],
            default: TPaymentStatus.pending
        },
        gatewayResponse: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },
    { timestamps: true }
);



export const PaymentTransaction = model<IPaymentTransaction>(
    'PaymentTransaction',
    paymentTransactionSchema
);


/***********************
    // For product purchases
    orderId: {//🔗
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: function() { return this.type.toString() === 'order'; }
    },
    // For subscription payments
    subscriptionId: { //🔗
      type: Schema.Types.ObjectId,
      // ref: 'UserSubscription',
      ref: 'Subscription',
      required: function() { return this.type.toString() === 'subscription'; } // 🔥🔥 bujhi nai 
    },

    bookedLabTestId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'LabTestBooking',
      required: function() { return this.type.toString() === 'labTest'; }
    },

    bookedAppointmentId : { //🔗
      type: Schema.Types.ObjectId,
      ref: 'DoctorPatientScheduleBooking',
      required: function() { return this.type.toString() === 'appointment'; }
    },

    bookedWorkoutClassScheduleId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'SpecialistPatientScheduleBooking',
      required: function() { return this.type.toString() === 'workoutClass'; }
    },

    bookedTrainingProgramId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingProgram',
      required: function() { return this.type.toString() === 'trainingProgram'; }
    },
    *********************************/