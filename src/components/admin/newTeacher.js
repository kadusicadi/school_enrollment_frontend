import { useForm } from 'react-hook-form';

const NewTeachers = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log(data);
    };

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Registracija novog nastavnika</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="first_name" className="block text-sm font-bold mb-2 mt-4">Ime</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        placeholder="Ukucajte ime nastavnika"
                        {...register('first_name', { required: "Polje je obavezno!" })}
                    />
                    {errors.first_name && <p className="text-red-500 italic">{errors.first_name?.message}</p>}
                    <label htmlFor="last_name" className="block text-sm font-bold mb-2 mt-4">Prezime</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        placeholder="Ukucajte prezime nastavnika"
                        {...register('last_name', { required: "Polje je obavezno!" })}
                    />
                    {errors.last_name && <p className="text-red-500 italic">{errors.last_name?.message}</p>}
                    <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">E-mail</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: "Polje je obavezno!" })}
                    />
                    {errors.email && <p className="text-red-500 italic">{errors.email?.message}</p>}
                    <label htmlFor="password" className="block text-sm font-bold mb-2 mt-4">Šifra</label>
                    <div className="relative">
                        <input
                            className="border rounded w-full py-2 px-3"
                            type='text'
                            placeholder="Ukucajte širu korisnika"
                            {...register('password', { required: "Polje je obavezno!" })}
                        />
                    </div>
                    {errors.password && <p className="text-red-500 italic">{errors.password?.message}</p>}
                    <input type="submit" value="Prijava" className="border rounded w-full py-2 px-3 mt-4 cursor-pointer" />
                </form>
            </div>
        </div>
    )
};

export default NewTeachers;